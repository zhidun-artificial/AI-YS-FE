import { httpPost } from '../http';

interface RenameConversationRequest {
  newName: string;
}

interface RenameConversationParams {
  id: string;
  newName: string;
}

export const renameConversation = async (params: RenameConversationParams) => {
  return httpPost<RenameConversationRequest, unknown>(
    `/api/v1/chat/conversations/${params.id}/rename`,
    params,
  );
};
