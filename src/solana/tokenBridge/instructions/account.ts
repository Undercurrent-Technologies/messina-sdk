import { createAssociatedTokenAccountInstruction, getAccount, TokenAccountNotFoundError, TokenInvalidAccountOwnerError } from "@solana/spl-token";
import { Connection, PublicKey, Transaction, } from "@solana/web3.js";

export async function buildInstructionsCreateTokenAccount(
  connection: Connection, 
  payer: PublicKey, 
  user: PublicKey,  
  associatedTokenAccount: PublicKey,
  mint: PublicKey,
  instructions: Transaction, 
) {
  try {
    await getAccount(connection, associatedTokenAccount);
  } catch (error: unknown) {
    if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
      instructions.add(
        createAssociatedTokenAccountInstruction(
          payer, 
          associatedTokenAccount, 
          user, 
          mint
        )
      );
    }
  }
}
