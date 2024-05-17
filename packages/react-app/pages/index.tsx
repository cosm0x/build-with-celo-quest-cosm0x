import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { stableTokenABI } from "@celo/abis";
import { getContract, formatEther, createPublicClient, http } from "viem";
import { celo, celoAlfajores } from "viem/chains";

const publicClient = createPublicClient({
  chain: celo,
  transport: http(),
}); // Mainnet

const STABLE_TOKEN_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

async function checkCUSDBalance(publicClient: any, address: string) {
  let StableTokenContract = getContract({
    abi: stableTokenABI,
    address: STABLE_TOKEN_ADDRESS,
    publicClient,
  });

  let balanceInBigNumber = await StableTokenContract?.read?.balanceOf([
    address,
  ]);

  let balanceInWei = balanceInBigNumber?.toString();

  let balanceInEthers = formatEther(balanceInWei || "0");

  return balanceInEthers;
}

export default function Home() {
  const [userAddress, setUserAddress] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState("");

  const getBal = async () => {
    let balance = await checkCUSDBalance(publicClient, address); // In Ether unit
    setBalance(balance);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
      getBal();
    }
  }, [address, isConnected]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="h1">
        There you go... a canvas for your next Celo project!
      </div>
      {isConnected ? (
        <div>
          <div className="h2 text-center">Your address: {userAddress}</div>
          <div className="h2 text-center">StableToken Balance - {balance}</div>
        </div>
      ) : (
        <div>No Wallet Connected</div>
      )}
    </div>
  );
}
