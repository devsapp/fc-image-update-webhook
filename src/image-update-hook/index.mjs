"use strict";
import FC20230330 from "@alicloud/fc20230330";
import * as $OpenApi from "@alicloud/openapi-client";
import * as $Util from "@alicloud/tea-util";
import $Stream from "@alicloud/darabonba-stream";
const runtime = new $Util.RuntimeOptions({});
const WORKER_FUNCTION_NAME = process.env.WORKER_FUNCTION_NAME;
let fcClient;

export const initialize = async (context) => {
  fcClient = new FC20230330.default(
    new $OpenApi.Config({
      accessKeyId: context.credentials.accessKeyId,
      accessKeySecret: context.credentials.accessKeySecret,
      securityToken: context.credentials.securityToken,
      endpoint: `${context.accountId}.${context.region}-internal.fc.aliyuncs.com`,
      readTimeout: 1000000,
      connectTimeout: 1000000,
    })
  );
  return "";
};

export const handler = async (event, context) => {
  const eventObj = JSON.parse(event);
  let body = "{}";
  if ("body" in eventObj) {
    body = eventObj.body;
    if (eventObj.isBase64Encoded) {
      body = Buffer.from(body, "base64").toString("utf-8");
    }
  }
  console.log(body);
  await fcClient.invokeFunctionWithOptions(
    WORKER_FUNCTION_NAME,
    new FC20230330.InvokeFunctionRequest({
      body: $Stream.default.readFromString(body),
    }),
    new FC20230330.InvokeFunctionHeaders({
      xFcInvocationType: "Async",
      commonHeaders: {
        "x-fc-async-delay": "15",
      },
    }),
    runtime
  );
  return {
    statusCode: 200,
    body: "done",
  };
};
