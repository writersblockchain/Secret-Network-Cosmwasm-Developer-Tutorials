# Secret Network Randomness Feature Documentation For Secret Contracts

### Introduction

Secret Network is a privacy-preserving blockchain platform that enables secure and private transactions and computations using secret contracts. The new randomness feature allows developers to access random numbers in their CosmWasm contracts, enhancing the capabilities of the platform.

### Background

The randomness feature is provided by the Secret Network and is accessible within Secret Contracts through the Env struct. It includes an optional random field, which contains a random number as a Binary type. The random field is only available when the "random" feature is enabled.

### Use Cases

Randomness is essential in many applications, including:

- Gaming and gambling platforms, where fair and unpredictable outcomes are crucial
- Cryptographic systems that require secure random keys or nonces
- Randomized algorithms for various use cases, such as distributed systems or optimization problems

### Coin Flip Tutorial

To follow along with this step-by-step Coin Flip tutorial, visit the [Secret Network docs](https://docs.scrt.network/secret-network-documentation/development/development-concepts/secret-vrf-on-chain-randomness/randomness-api).
