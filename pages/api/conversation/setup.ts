import type { NextApiRequest, NextApiResponse } from "next";
import { Operators, MessageType, RecepientType } from "intercom-client";
import intercom from "@/lib/intercom";
import { authN } from "@/lib/middleware/auth";
import { asyncHandler } from "@/lib/middleware/async-handler";
import { TUser } from "@/lib/realm/types";
import { delay } from "@/lib/utils";
import config from "@/config/index";

const INTERCOM_ADMIN_ID = "5599899";
const INTERCOM_OUTBOUND_MESSAGE =
  "Welcome to Realm. We'd love to help you get started. What are you looking to do? ✨";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  const user: TUser = req.ctx.user;

  /**
   * Goal: Generate a link from user <-> contact and user <-> conversation to integrate both systems
   *
   * Find previously linked contact or find best possible existing contact matching user fields
   * Create or update contact with user info, generating link from contact external_id to user
   * Create outbound message from workspace admin to contact
   * Retrieve the conversation for the outbound message
   * Update user fields, generating link from user to contact and  user to conversation
   */

  // Link between contact/conversation and user already set
  if (user.intercom_contact_id && user.intercom_conversation_id) {
    return { message: "ok" };
  }

  let contact;

  // Find previously linked
  if (user.intercom_contact_id) {
    try {
      contact = await intercom.contacts.find({ id: user.intercom_contact_id });
    } catch (e) {
      // ignore Not Found
      console.log("Link not found", e);
    }
  }

  // Find best possible existing contact matching user fields:
  // Users's id/email/full_name vs contact's external_id/email/name
  // Must disregard nulls (would actually match contacts with null fields)
  if (!contact) {
    const searchContactRes = await intercom.contacts.search({
      data: {
        query: {
          operator: Operators.OR,
          value: [
            {
              operator: Operators.AND,
              value: [
                {
                  field: "external_id",
                  operator: Operators.EQUALS,
                  value: String(user.id),
                },
                {
                  field: "external_id",
                  operator: Operators.NOT_EQUALS,
                  value: null,
                },
              ],
            },
            {
              operator: Operators.AND,
              value: [
                {
                  field: "email",
                  operator: Operators.EQUALS,
                  value: user.email,
                },
                {
                  field: "email",
                  operator: Operators.NOT_EQUALS,
                  value: null,
                },
              ],
            },
            {
              operator: Operators.AND,
              value: [
                {
                  field: "name",
                  operator: Operators.EQUALS,
                  value: user.full_name,
                },
                {
                  field: "name",
                  operator: Operators.NOT_EQUALS,
                  value: null,
                },
              ],
            },
          ],
        },
      },
    });

    // If multiple matches - ie: one by email, other by name, the correct action would probably be merging them
    // absolutely ensuring they belong to the same entity.
    // Better to consider multi match as not found and create a new one
    if (searchContactRes.total_count == 1) {
      contact = searchContactRes.data[0];
    }
  }

  console.log("contact", contact);

  const upsertPayload = {
    externalId: String(user.id),
    email: user.email,
    phone: user.phone_number,
    avatar: user.profile_image,
  };

  console.log("upsertPayload", upsertPayload);

  // Got contact but missing link for any reason, ie: added via intercom with email, never linked
  if (contact && !contact.external_id) {
    contact = await intercom.contacts.update({
      id: contact.id,
      ...upsertPayload,
    });
  }

  // Still no contact, create a new linked one
  if (!contact) {
    contact = await intercom.contacts.createUser(upsertPayload);
  }

  // Create an in-app outbound message.
  const message = await intercom.messages.create({
    messageType: MessageType.INAPP,
    body: config.intercom.outboundMessage,
    template: "plain",
    from: {
      type: RecepientType.ADMIN,
      id: config.intercom.adminId,
    },
    to: {
      type: RecepientType.USER,
      id: contact.id,
    },
    // Set to true to force a new conversation to be created without first waiting for user to reply
    createConversationWithoutContactReply: true,
  });

  console.log("message", message);

  // Could be all set if message.conversation_id was returned when createConversationWithoutContactReply: true
  // but not working... TODO: open ticket

  // Workaround: Find the conversation which source.id matches the outbound message id
  // Must give Intercom a few seconds to index conversation, won't find it if not, weird...
  // https://github.com/intercom/intercom-node/pull/319/files/f02265bcc865f8791bd131b5a5bcf55218e79deb
  await delay(5000);

  const searchConversationRes = await intercom.conversations.search({
    data: {
      query: {
        field: "source.id",
        operator: Operators.EQUALS,
        value: message.id,
      },
    },
  });

  const conversation = searchConversationRes.conversations[0];

  console.log("CONVERSATION", conversation);

  // @ts-ignore
  const updatedUser = await req.ctx.realm.users.update({
    id: "me",
    social_facebook: JSON.stringify({
      intercom_contact_id: contact.id,
      intercom_conversation_id: conversation.id,
    }),
  });

  return { contact, message, conversation, user: updatedUser };
};

export default authN(asyncHandler(handler, { method: "get" }));
