import readline from 'readline';

(async function () {
    function askQuestion(query: string) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise(resolve => rl.question(query, (ans: string) => {
            rl.close();
            resolve(ans);
        }))
    }


    const ans = await askQuestion("Are you sure you want to deploy to PRODUCTION? ");
    console.log(ans);
})();
