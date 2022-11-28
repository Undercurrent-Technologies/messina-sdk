import { loadPackageDefinition, credentials } from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'
import { _parseVAAAlgorand } from "../algorand";

export async function getSignedVAA(
  host: string,
  emitterAddress: string,
  emitterChain: string,
  sequence: string,
  retryTimeout = 1000,
  retryAttempts?: number
) {
  var packageDefinition = loadSync(`${__dirname}/../../protos/publicrpc.proto`, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })

  // @ts-ignore
  var proto = loadPackageDefinition(packageDefinition).publicrpc.v1
  var client = new proto.PublicRPCService(
    host,
    credentials.createInsecure()
  )

  let signedVAA
  let attempts = 0;

  while (!signedVAA) {
    attempts++;

    await new Promise((resolve) => setTimeout(resolve, retryTimeout));

    try {

      signedVAA = await new Promise((res, rej) => {
        client.GetSignedVAA(
          {
            message_id: {
              emitter_address: emitterAddress,
              emitter_chain: emitterChain,
              sequence: sequence,
            },
          },
          function (err: any, response: any) {
            if (err && err.details === 'requested VAA not found in store') {
              rej("requested VAA not found in store");
              return
            } else if (response) {
              console.log('got response for vaa')
              // signedVAA = response.vaa_bytes.toString('hex')
              // console.log('got response for vaa signedVAA', response.vaa_bytes.toString('hex'))
              res(response.vaa_bytes.toString('hex'))
            } else {
              rej("no error or response, retrying");
              return
            }
          }
        )
      })

    } catch (e) {
      if (retryAttempts !== undefined && attempts > retryAttempts) {
        throw e;
      }
    }
  }

  if (signedVAA) return signedVAA
}

export default getSignedVAA;
