import fetch from 'node-fetch';
import { sessionClient } from './runSample';
import dialogflow from 'dialogflow';
const botAuth = JSON.parse(process.env.master_bot);

exports.handler = async (event) => {
  // "event" has information about the path, body, headers, etc. of the request
  const request = JSON.parse(event.body);
  const contextSet = await createContext(request);
  return {
    statusCode: 200,
    body: "set context", contextSet
  }
}

export let contextsClient = new dialogflow.ContextsClient({
    projectId: '',
    credentials: {
      private_key: botAuth.private_key,
      client_email: botAuth.client_email
    }
  });


async function createContext(request) {
  //path for contexts
  sessionClient.projectId = request.bot.projectId;
  contextsClient.projectId = request.bot.projectId;

  const sessionPath = sessionClient.sessionPath(request.bot.projectId, request.bot.sessionId);

  console.log('creating context', request)

  const contextPath = contextsClient.contextPath(
    request.bot.projectId,
    request.bot.sessionId,
    request.contextId
  );

  // The context query request.
  const createContextRequest = {
    parent: sessionPath,
    context: {
          name: contextPath,
          lifespanCount: request.lifespan,
    },
  };

  //create a new context
  const createdContext = await contextsClient.createContext(createContextRequest);
  return createdContext;
}