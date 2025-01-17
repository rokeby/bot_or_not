import fetch from 'node-fetch';
import { sessionClient } from './runSample';
import { contextsClient } from './createContext';
import dialogflow from 'dialogflow';
const botAuth = JSON.parse(process.env.master_bot);

exports.handler = async (event) => {
	// "event" has information about the path, body, headers, etc. of the request
	const request = JSON.parse(event.body);
	console.log('got request', request)
	const contextResponse = await listContexts(request);
	return{
		statusCode: 200,
		body: contextResponse
	}
}

async function listContexts(request){
	//set sessionclient for this project
	contextsClient.projectId = request.bot.projectId;
	sessionClient.projectId = request.bot.projectId;

	const sessionPath = sessionClient.sessionPath(request.bot.projectId, request.bot.sessionId);

	const contextRequest = {
	    parent: sessionPath,
	  }

	try {
		const [contextResponse] = await contextsClient.listContexts(contextRequest);
			if(contextResponse !== undefined && contextResponse.length !== 0){
			// var name = contextResponse[0].name.split("/").slice(-1)[0];
			console.log('context set is', contextResponse)
		}
		return "context set successfully";
	}
    catch (err) {
        return 'error setting context'
    }
}