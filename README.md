# `dfx_server`

Welcome to your new `dfx_server` project and to the Internet Computer development community. By default, creating a new project adds this README and some template files to your project directory. You can edit these template files to customize your project and to include your own code to speed up the development cycle.

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with `dfx_server`, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd dfx_server/
dfx help
dfx canister --help
```

## Running the project locally

In order to be authenicated with ICP, you must run and download internetidentity. Run in seperate folder:
```bash 
git clone https://github.com/dfinity/internet-identity.git
# assuming in internetidentity folder
cd demos/using-dev-build

#clear any premade stuff if its there
rm -rf .dfx
npm ci

dfx start --background --clean

dfx deploy



# Cntrl+Click webapp
# Press signin, create new identity (should be 10000 for dev build) and then copy the url 
```
![Screenshot 2025-05-05 102832](https://github.com/user-attachments/assets/3f614cf9-9444-4638-baea-cc80a20ace97)
# IT NEEDS TO SAY YOUR ID CHAIN BEFORE YOU PROCEED

Its long and has like 20 symbols

# DO NOT CLOSE PROGRAM, copy that url and paste here in your .env folder:
![Screenshot 2025-05-05 103151](https://github.com/user-attachments/assets/ab29dd94-31ab-454e-947e-83c4b7549caa)

``` bash
cd ../dfx_server
# Or where ever you have the actual project
rm -rf .dfx # clear the binaries if it imports wrong thing
npm ci 
dfx deploy
# 
```
\

