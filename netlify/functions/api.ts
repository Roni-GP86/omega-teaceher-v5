import serverless from "serverless-http";
import { getApp } from "../../server.ts";

let handlerInstance: any = null;

export const handler = async (event: any, context: any) => {
  if (!handlerInstance) {
    const app = await getApp();
    handlerInstance = serverless(app);
  }
  return handlerInstance(event, context);
};
