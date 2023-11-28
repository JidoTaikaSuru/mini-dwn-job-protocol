import { Web5 } from "@web5/api";
import { addJob } from "./jobs"
import { input, confirm, select } from '@inquirer/prompts';

let did: string;
let web5: Web5;

export default async function hire(web5connect: Web5, didConnect: string) {
    did = didConnect;
    web5 = web5connect;

    const title = await input({
        message: "Type the title of your job:",
    });

    const description = await input({
        message: "Sounds exciting! Tell me more details about the job:",
    });

    const confirmJob = await confirm({
        message: "Looks nice for me, should we save and post this job?",
    });

    if (confirmJob) {
        await addJob(web5, did, title, description);
    }
    else {

        const confirmQuit = await select({
            message: "What are we going to do next?",
            choices: [
                {
                    name: "Create another job",
                    value: "job",
                },
                {
                    name: "Quit",
                    value: "quit",
                }]
        });
        if (confirmQuit == "job") {
            hire(web5, did);
        }
        else {
            return;
        }

    }
}