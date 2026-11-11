# S1 English Hub: how to put it online for free (with the AI)

You need 3 free accounts: Google (for the AI key), GitHub (to store the files), Netlify (to show the website).
Unzip this folder on your computer first. Do not upload the .zip itself.

## Step 1. Get the free AI key (2 minutes)
1. Go to https://aistudio.google.com and sign in with your Google account.
2. Click "Get API key", then "Create API key".
3. Copy the key and keep it private. Never put it in the website file or send it in WhatsApp.

## Step 2. Put the files on GitHub (5 minutes)
1. Create an account at https://github.com.
2. Click "New repository". Name it s1-english-hub. Keep it Public (or Private, both work). Create it.
3. Click "uploading an existing file".
4. Open the unzipped folder and drag EVERYTHING inside it into the page: the folders `public` and `netlify`, and the files `netlify.toml` and `README.md`.
5. Click "Commit changes".

## Step 3. Publish on Netlify (5 minutes)
1. Create an account at https://app.netlify.com (choose "Sign up with GitHub").
2. Click "Add new site", then "Import an existing project", then GitHub, then choose s1-english-hub.
3. Leave the build settings as they are and click "Deploy".
4. Open "Site configuration", then "Environment variables", then "Add a variable".
   - Key: GEMINI_API_KEY
   - Value: the key from Step 1
5. Go to "Deploys", then "Trigger deploy", then "Deploy site" so the key is used.
6. In "Site configuration", then "Change site name", pick something short, like s1-english-fllae.

Your link is https://YOUR-NAME.netlify.app. Send it to the WhatsApp groups.

## Step 4. Test before you share
- Open the link on your phone.
- Upload a small PDF in "AI assistant" and press Summarize.
- Ask a question in "Ask a question".
- Open "Quizzes", finish one, and press "5 new AI questions".

## If the AI says something went wrong
- "The AI is not configured yet": the key is missing. Redo Step 3.4 and 3.5.
- "The AI service returned an error": Google may have renamed the model. In Netlify add a variable GEMINI_MODEL with the model name written in the Gemini docs (https://ai.google.dev/gemini-api/docs/models), then deploy again.
- "The free AI limit was reached": the free plan has limits per minute and per day. Wait a few minutes. If many students use it at once, this will happen sometimes.

## Good to know
- Texts and PDFs students send to the AI go to Google's Gemini service. Tell students not to upload private documents.
- The function limits each visitor to 25 AI requests per hour to protect your free quota.
- To change anything in the website later, edit `public/index.html` on GitHub. Netlify updates the site by itself.

Made by Nora Moualla.
