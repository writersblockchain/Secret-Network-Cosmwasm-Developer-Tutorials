INTRO

Gm everyone, today you're going to learn the basics of working with cosmwasm smart contracts on Secret Network, you're going to learn how to write your first secret contract, and you will also learn how to create unit tests using the rust testing framework as well as additional cosmwasm testing utilities. And in the next video you will learn how to actually upload, instantiate, and execute this smart contract on Secret testnet. Let's dive in!

WHAT IS COSMWASM?

If you are new to CosmWasm it is a platform for writing smart contracts for Cosmos chains using Rust and WebAssembly. Meaning CosmWasm is your one-stop shop for developing, testing, and running smart contracts on enabled chains, such as Secret Network. Secret contracts are a fork of CosmWasm that provide additional privacy capabilities using Secret's trusted execution environment so that you can write contracts with confidential metadata, including private tokens, NFTs, real-world assets and whatever you can imagine. 

Secret uses cosmWasm because it provides a high-quality library that includes:

- cryptographic primitives, 
- interaction with the Cosmos SDK, as well as 
- IBC connectivity.  

PREREQUISITES

To get started, you'll need to download rust to write your smart contracts as well as Make and docker to compile your contracts so that you can upload them to secret network. I'll link to these below. 

Let's start by creating an empty Rust project. 

You can do this by writing "cargo new" followed by the name of your project. Im going to call mine hello_world 

 cargo new hello_world

Now you'll see a folder called hello_world which contains a cargo.toml file and folder called src which has a main.rs file. If you open main.rs you will see that it prints hello world to the terminal. To run this simple program you can cd into hello_world and then write cargo run. 

This will build and run the application. As you can see, Hello World was logged to the terinal. Right now this is a simple rust application. Now let's learn how to turn it into a cosmwasm smart contract that we can deploy to secret network. 

First, I am going to run cargo clean to remove the build artifcats that we just created. 

Ah. There's nothing better than a tidy home. 

You already created a simple Rust library, now to turn it into a secret smart contract The first thing to do is to update the Cargo.toml file like so: 

I added two core dependencies for Secret smart contracts: secret-cosmwasm-std and secret-cosmwasm-storage. Every smart contract we build will use these dependencies.

ENTRY POINTS

Typical Rust application starts with the main() function as you can see here. Unlike native rust applications, which have only a single main entry point, Secret smart contracts have multiple entry points which correspond to different actions you want your contract to perform. 

To start, we will learn about the three most commonly used entry points which are instantiate, execute, and query. Everything you program into your secret smart contract will be executed through these three entry points. 

- instantiate is called once per smart contract lifetime - you can think about it as a constructor or initializer of a contract. When you create the contract, you call the instantiate entrypoint, and then that' it for instantiate. from now on you're using the execute or query entrypoints. 
- execute is used for handling messages which modify contract state - so any time you store data in your smart contract, or send tokens, or mint NFTs, that's using the execute entry point. 
- and lastly, the query entrypoint is used for querying your smart contract and does not make any changes to the contract's state. 

Now that you have your dependencies properly configured in your cargo.toml and you know the basics of working with cosmwasm entry points, let's turn this rust application into your first secret smart contract. 

To start, delete main.rs, and create 4 empty files called state.rs, msg.rs, contract.rs, and lib.rs. Together, these 4 files make up your entire smart contract. 

State.rs handles state management, defining how data is stored, accessed, and updated within the contract's storage.

Msg.rs defines the messages used for interacting with the contract. These messages represent the inputs sent to the contract during initialization, execution, and queries. Simply put, it's what the contract actually does. Oftentimes, if I am reading someone else's smart contract, I will open message.rs first to get a preliminary understanding of the smart contract's intended functionality. 

Contract.rs is the core implementation file that glues your smart contract together. It contains the main logic for the contract's entry points, such as instantiate, execute, and query. And it also includes functions defining how the contract behaves when it's instantiated, executed, and queried. 

Lastly, the lib.rs file, aka the library file, defines your smart contract structure and makes the files accessible for the CosmWasm runtime. To get started, add the following to your lib.rs file

Great! Now that you have the basic structure of your smart contract all set up and ready to go, we have to decide what we want the smart contract to actually do. To keep it simple, let's write a basic secret contract that stores a password and the password is only revealed if we enter the correct key. 

Let's start by defining how we store and access our data. Open state.rs and define a password keymap called keymap. Let's make both the key a string and the value a struct called Password like so. 

One of the benefits of working with cosmwasm is that the rust compiler provides detailed error messages that helpfully guide the smart contract development process. In this case, the rust compiler is telling us that we need to import Keymap. Let's do that. 

CosmWasm storage uses a key-value storage design. Smart contracts can store data in binary, access it through a storage key, edit it, and save it. Similar to a HashMap, each storage key is associated with a specific piece of data stored in binary. This is what the b before "password" does. It represents the string "password" as a sequence of bytes. This is often used in scenarios where the input needs to be treated as raw binary data.

Any type of data can be stored this way as long as the user can serialize and deserialize the data to and from binary. We can do this using a few helper libraries which implement frequently used traits for the associated struct or enum. You can add these packages to your cargo.toml like so.

Now I'm going to create a struct called Password which we will use to store our password data. So now we have a keymap called Password, which takes a String for a key, and a struct we defined called Password as a value. So the Password will be uniquely mapped to whatever String we define. 

Now let's definte the message types. Navigate to msg.rs and start by creating the InstantiateMsg.

This struct is needed in every contract you write in order to instantiate it on the blockchain. We don't need any parameters inside of our instantiate message, but you could add additional parameters if you wished such as a wallet address that serves as the admin for the contract. 

Next, create the ExecuteMsg. 

The executeMsg represents the actions the smart contract can execute after deployment. In our case, we want to store a password, so I wrote a variant called StorePassword, which invokes a contract method that stores a password. It takes a parameter called Password_value of type string which is the password we will store in the secret contract. 

Now let's define our query message. I'm going to call it GetPassword, which will serve as a query to retrieve the stored password, and it takes the String password_key, which will be the key associated with the value aka password we store in the Secret contract. 

Lastly, we need to create a struct that can return our password query. I'm going to simply call it "password response." 
Now we've defined messages that allow us to instantiate the contract, store a password, and query the password. The final step is to write the contract logic in the contract.rs file to bring everything together. 

For the sake of time, I've already written the contract logic and you can find the completed code in the video description below. Let's walk through each part of the code together. 





