export type TUser = {
  id: number;
  email: string;
  full_name: string;
  phone_number: string;
  profile_image: string;
  // will use to JSON.stringify({ intercom_contact_id, intercom_conversation_id }) until actually added
  social_facebook: string;
  intercom_contact_id: string;
  intercom_conversation_id: string;
};
