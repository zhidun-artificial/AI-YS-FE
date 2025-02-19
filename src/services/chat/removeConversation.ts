import { httpDelete } from '../http';

interface RemoveConversationParams {
  id: string;
}

export const removeConversation = async (params: RemoveConversationParams) => {
  return httpDelete<unknown, unknown>(
    `/api/v1/chat/conversations/${params.id}`,
    params,
  );
};
