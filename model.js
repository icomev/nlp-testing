const { NlpManager } = require('node-nlp');
const fs = require('fs');
const path = require('path');

async function trainModel() {
  const manager = new NlpManager({ languages: ['en'], forceNER: true });
  const modelPath = path.join('/home/david/Skrivbord/noish/', 'model.nlp');

  if (fs.existsSync(modelPath)) {

    manager.load(modelPath);
    console.log('Model loaded');
  } else {
    // Load
    const dataPath = path.join('/home/david/Skrivbord/noish/', 'data.txt');
    const lines = fs.readFileSync(dataPath, 'utf8').split('\n');
    
    //loopar igenom varje line i .txt
    for (const line of lines) {
      const parts = line.split(':');
      if (parts.length === 2) {
        const intent = parts[0].trim();
        const utterance = parts[1].trim();
        manager.addDocument('en', utterance, intent);
      }
    }

    await manager.train();
    //manager.save(modelPath);
    console.log('Model trained & saved.');
  }

  // tessst
  const response1 = await manager.process('en', 'i love coding!');
  console.log('Intent:', response1.intent, 'Score:', response1.score);
  console.log(response1);

  const response2 = await manager.process('en', 'what time is it?');
  console.log('Intent:', response2.intent, 'Score:', response2.score);
  console.log(response2);
}

trainModel();
