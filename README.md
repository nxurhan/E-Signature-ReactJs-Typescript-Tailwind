I. Introduction 
This user manual will guide you through the process of setting up Visual Studio Code, cloning our
project from GitHub, installing Node.js and npm, and running a project using these tools.

II. Prerequisites 
Before you begin, make sure you have the following prerequisites:
- A computer running a supported operating system (e.g., Windows, macOS, Linux).
- An internet connection.
- Administrative privileges on your computer (for software installation).
- Basic knowledge of command-line interfaces.
  
III. Installing Visual Code 
1. Here are the steps to install Visual Studio:
2. Visit the official Visual studio code website:
3. Click on the "Download for [Your OS]" button to download the installer for your operating system (e.g., Windows, macOS, Linux).
4. Wait for download to finish
5. Run the installer and follow the on-screen instructions to install Visual Studio Code.
6. Follow the installer's prompts to complete the installation process. No need to customize any settings (keep default), then click install.
7. Once installation is complete, launch Visual Code.

IV. Installing Git 
For Windows:
Visit the official Git website: https://git-scm.com/download/win
1. Your download will start automatically. Once it's finished, open the installer.
2. In the installer, follow the steps below:
• Select the language you want to use during the installation process and click "Next."
• Read the Git License Agreement, and if you agree, click "Next."
• Choose the installation location. The default location is usually fine, so you can leave it as is. Click "Next."
3. On the "Select Components" screen, you can leave all the default components selected. Click "Next."
4. On the "Choosing the default editor used by Git" screen, you can choose your preferred text editor for Git. Click "Next.
5. On the "Adjusting your PATH environment" screen, select "Use Git from the Windows Command Prompt." This option allows you to use Git from the Windows Command Prompt or PowerShell. Click "Next."
6. On the "Choosing HTTPS transport backend" screen, you can choose "Use the OpenSSL library" or "Use the native Windows Secure Channel library." The default option is usually fine. Click "Next."
7. On the "Configuring the line ending conversions" screen, select "Checkout Windows-style, commit Unix-style line endings." Click "Next."
8. On the "Configuring the terminal emulator to use with Git Bash" screen, you can choose your preferred terminal emulator. The default option is usually fine. Click "Next."
9. On the "Configuring extra options" screen, you can leave all the default options selected. Click "Next."
10. Review your selections on the "Installing" screen, and then click "Install."
11. Wait for the installation to complete. Once it's done, click "Finish."

For macOS:
1. Open Terminal, which you can find in the "Utilities" folder within the "Applications" folder or 
by searching for it in Spotlight.
2. To check if Git is already installed, enter the following command and press Enter:
git --version
If Git is not installed, macOS will prompt you to install the Xcode Command Line Tools. Follow the onscreen instructions to complete this installation.

V. Cloning a GitHub Repository 
Now that you have Visual Studio Code installed and git ,you can clone a GitHub repository to work on 
a project. Here's how to do it:
1. Open Visual Studio Code. (you need to reload it if it was open)
2. Click on the "Clone Git Repository”
3. Enter the URL of the GitHub which is https://github.com/nmit6150/Signature-app and press enter
4. Choose a local directory where you want to save the cloned project
5. Once you select repository it will start the cloning process.
6. Visual Studio Code will download the repository and open it in a new workspace.
7. If this warning appears: just press “Yes, I trust the authors”

VI. Installing Node.js and npm 
1. To work with JavaScript projects, you'll need Node.js and npm (Node Package Manager). 
Follow these steps to install them:
2. Visit the official Node.js website: https://nodejs.org/ .
3. Download the LTS (Long-Term Support) version of Node.js for your operating system (e.g., Windows, macOS, Linux).
4. Run the Node.js installer and follow the on-screen instructions to install Node.js.
5. After Node.js is installed, open your computer's command-line interface (e.g., Command 
Prompt on Windows, Terminal on macOS/Linux). If on windows, click start, seach command prompt, right click on it, run as administrator.
6. To verify that Node.js and npm are installed correctly, run the following commands in the prompt (this will take some time):
node -v
npm -v
These commands should display the installed Node.js and npm versions.

VII. Running the Project 
Once you have cloned the GitHub repository and installed Node.js and npm, you can run the project using the following steps:
1. Open Visual Studio Code (close the previous opened window and reopen) and navigate to 
the project workspace you cloned in step 5
2. Open an integrated terminal in Visual Studio Code by clicking "View" > "Terminal" or using 
the shortcut Ctrl+ (backtick) or Cmd+ (backtick) on macOS.
3. Navigate to the project's directory within the integrated terminal using the cd command.
4. Run the following command to install project dependencies using npm: npm install
Wait until installation is finished because this will take some time and you can write a new 
command.
5. Once the dependencies are installed, you can start the project by running: npm start
6. Wait few minutes until the browser is opened and the app is loading.
7. Now you can navigate through out the app. Enjoy
