import { Web5 } from "@web5/api";
import hire from "./hire"
import { getJobs } from "./jobs"
import { select } from '@inquirer/prompts';
import protocolDefinition from "./assets/protocol.json";

const { web5, did: myDID } = await Web5.connect();

const configureProtocol = async (protocolDefinition) => {
  // query the list of existing protocols on the DWN
  const { protocols, status } = await web5.dwn.protocols.query({
      message: {
          filter: {
              protocol: protocolDefinition.protocol,
          }
      }
  });

  if(status.code !== 200) {
      alert('Error querying protocols');
      console.error('Error querying protocols', status);
      return;
  }

  // if the protocol already exists, we return
  if(protocols.length > 0) {
      console.log('Protocol already exists');
      return;
  }

  // configure protocol on local DWN
  const { status: configureStatus, protocol } = await web5.dwn.protocols.configure({
      message: {
          definition: protocolDefinition,
      }
  });
}

await configureProtocol(protocolDefinition);

console.log(myDID);

console.log();
console.log("=================================");
console.log();

console.log(`Hello, Welcome to Decentralinked!`);

console.log();
console.log("=================================");
console.log();


const start = await select({
    message: "How do you want to start?",
    choices: [
        {
            name: "I want to hire a talent",
            value: "hire",
        },
        {
            name: "I want to find a job",
            value: "apply",
        }]
});

console.log();

if (start == "hire") {
    console.log("Awesome! You're about to hire a Genius soon!");

    await hire(web5, myDID);
    
    console.log("Congratulations! Your job is saved and posted.");
}
else if (start == "apply") {
    console.log("Awesome! You're about to find a Unicorn to work at soon!");
    console.log();
    console.log("Let me show you some of the fantastic jobs I have:");
    console.log();

    const jobs = await getJobs(web5);
    console.log(jobs[0]);

    const applyOption = await select({
        message: "Like the job?",
        choices: [
            {
                name: "I like that, let's apply!",
                value: "apply",
            },
            {
                name: "Nah, show me another one.",
                value: "decline",
            }]
    });
}

