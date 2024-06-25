"use strict";

import FC20230330, * as $FC20230330 from "@alicloud/fc20230330";
import * as $OpenApi from "@alicloud/openapi-client";
import * as $Util from "@alicloud/tea-util";
import cr20181201, * as $cr20181201 from "@alicloud/cr20181201";

const AUTO_UPDATE_FUNCTIONS = process.env.AUTO_UPDATE_FUNCTIONS;
const getFunctionRequest = new $FC20230330.GetFunctionRequest({});
const runtime = new $Util.RuntimeOptions({});
const headers = {};
let fcClient;
let crClient;

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
  crClient = new cr20181201.default(
    new $OpenApi.Config({
      accessKeyId: context.credentials.accessKeyId,
      accessKeySecret: context.credentials.accessKeySecret,
      securityToken: context.credentials.securityToken,
      endpoint: `cr-vpc.${context.region}.aliyuncs.com`,
      readTimeout: 1000000,
      connectTimeout: 1000000,
    })
  );
  return "";
};

export const handler = async (event, context) => {
  const payload = JSON.parse(event);
  let acreeEndpoint;
  if (payload?.repository?.instanceId) {
    const cr = await crClient.getInstanceEndpointWithOptions(
      new $cr20181201.GetInstanceEndpointRequest({
        instanceId: payload?.repository?.instanceId,
        endpointType: "Internet",
      }),
      runtime
    );
    acreeEndpoint = cr.body.domains[0].domain;
  }
  let functions =
    AUTO_UPDATE_FUNCTIONS === "*"
      ? await listAllFunctions()
      : await listFunctionsByNames(AUTO_UPDATE_FUNCTIONS.split(","));

  functions = functions.filter(
    (fc) =>
      fc.runtime === "custom-container" &&
      shouldUpdateImage(
        fc?.customContainerConfig?.image,
        payload?.push_data?.tag,
        payload?.repository?.repo_full_name,
        acreeEndpoint
      )
  );
  await Promise.all(functions.map((fc) => updateFunctionImage(fc, payload)));
  return "done";
};

function shouldUpdateImage(image, newTag, repoFullName, acreeEndpoint) {
  if (!image || !newTag || !repoFullName) {
    return false;
  }
  const [, tag = "latest"] = image.split(":");
  if (
    tag.endsWith("_accelerated") &&
    (!newTag?.endsWith("_accelerated") ||
      newTag?.endsWith("_containerd_accelerated"))
  ) {
    return false;
  }
  if (acreeEndpoint) {
    if (acreeEndpoint !== image.replace("-vpc.", ".").split("/")[0]) {
      return false;
    }
  }
  if (repoFullName === image.split(":")[0].split("/").splice(1).join("/")) {
    return true;
  }
  return false;
}

async function updateFunctionImage(fc, payload) {
  const newImage =
    fc?.customContainerConfig?.image.split(":")[0] +
    ":" +
    payload?.push_data?.tag;

  await fcClient.updateFunctionWithOptions(
    fc.functionName,
    new $FC20230330.UpdateFunctionRequest({
      body: new $FC20230330.UpdateFunctionInput({
        customContainerConfig: new $FC20230330.CustomContainerConfig({
          image: newImage,
        }),
      }),
    }),
    headers,
    runtime
  );
  console.log(
    `Image of function ${fc.functionName} has been updated to ${newImage}`
  );
}

async function listFunctionsByNames(functionNames) {
  const requests = functionNames.map((functionName) =>
    fcClient.getFunctionWithOptions(
      functionName,
      getFunctionRequest,
      headers,
      runtime
    )
  );
  const results = await Promise.allSettled(requests);
  return results
    .filter((result) => result.value)
    .map((result) => result.value.body);
}

async function listAllFunctions() {
  let stop = false;
  let nextToken = "";
  const out = [];
  while (!stop) {
    const data = await fcClient.listFunctionsWithOptions(
      new FC20230330.ListFunctionsRequest({
        limit: 100,
        nextToken,
      }),
      headers,
      runtime
    );
    out.push(...data.body.functions);
    if (data.body.nextToken) {
      nextToken = data.body.nextToken;
    } else {
      stop = true;
    }
  }
  return out;
}
