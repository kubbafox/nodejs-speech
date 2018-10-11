/**
 * Copyright 2018, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START speech_transcribe_async]
// Imports the Google Cloud Speech API client library
const speech = require('@google-cloud/speech');

// Import other required libraries
const fs = require('fs');

/**
 *  Inspects the provided text.
 *
 * @param filepath {string} The path to the file to inspect.
 * @returns {object} The LongRunningRecognizeResponse.
 */
async function main(
  filepath = 'path/to/audio.raw',
  encoding = 'LINEAR16',
  sampleRateHertz = 16000,
  languageCode = 'en-US',
) {
  // Creates a client
  const client = new speech.SpeechClient();

  // Get the bytes of the file
  const fileBytes = Buffer.from(fs.readFileSync(filepath)).toString('base64');

  const request = {
    audio: {
      content: fileBytes,
    },
    config: {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    },
  };

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);

  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: ${transcription}`);

  return response;
}
// [END speech_transcribe_async]

main(...process.argv.slice(2));
