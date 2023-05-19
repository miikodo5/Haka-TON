const TonWeb = require('tonweb');
require('dotenv').config();

const BN = TonWeb.utils.BN;

const toNano = TonWeb.utils.toNano;

class TonService {

    constructor() {    

        this.channelActive = false;
        this.channelLoading = false;
        const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC';
        const apiKey = process.env.TON_API_KEY;
        this.tonweb = new TonWeb(new TonWeb.HttpProvider(providerUrl, {apiKey}));
                    
    }

    async initWallets() {
        const seedA = TonWeb.utils.base64ToBytes(process.env.TON_SEED_A); 
        this.keyPairA = this.tonweb.utils.keyPairFromSeed(seedA);

        this.walletA = this.tonweb.wallet.create({
            publicKey: this.keyPairA.publicKey
        });
        this.walletAddressA = await this.walletA.getAddress();
        console.log('walletAddressA = ', this.walletAddressA.toString(true, true, true));


        const seedB = TonWeb.utils.base64ToBytes(process.env.TON_SEED_B);
        this.keyPairB = this.tonweb.utils.keyPairFromSeed(seedB);

        this.walletB = this.tonweb.wallet.create({
            publicKey: this.keyPairB.publicKey
        });
        this.walletAddressB = await this.walletB.getAddress();
        console.log('walletAddressB = ', this.walletAddressB.toString(true, true, true));
    }

    startChannel() {
        return new Promise(async(resolve, reject) => {

            if (this.channelActive || this.channelLoading) reject('Channel already active!')

            this.channelLoading = true

            const balanceA = await this.tonweb.getBalance(this.walletAddressA);
            console.log('balanceA = ', (new BN(balanceA).toNumber()))
            
            const balanceB = await this.tonweb.getBalance(this.walletAddressB);
            console.log('balanceB = ', (new BN(balanceB).toNumber()))
            
            const channelInitState = {
                balanceA: toNano('10'),
                balanceB: toNano('0.5'), 
                seqnoA: new BN(0),
                seqnoB: new BN(0)
            };

            this.lastState = channelInitState;

            console.log('Init A: ', channelInitState.balanceA.toNumber(), '; Init B: ', channelInitState.balanceB.toNumber())

            const channelConfig = {
                channelId: new BN(Math.floor(Math.random() * 1000) + 10), //32 has my money - balA = 10, balB = 4, seqnoa = 1 or 2 (check) | 
                addressA: this.walletAddressA,
                addressB: this.walletAddressB, 
                initBalanceA: channelInitState.balanceA,
                initBalanceB: channelInitState.balanceB
            }

            this.channelA = this.tonweb.payments.createChannel({
                ...channelConfig,
                isA: true,
                myKeyPair: this.keyPairA,
                hisPublicKey: this.keyPairB.publicKey,
            });
            const channelAddress = await this.channelA.getAddress();
            console.log('channelAddress=', channelAddress.toString(true, true, true));

            this.channelB = this.tonweb.payments.createChannel({
                ...channelConfig,
                isA: false,
                myKeyPair: this.keyPairB,
                hisPublicKey: this.keyPairA.publicKey,
            });

            if ((await this.channelB.getAddress()).toString() !== channelAddress.toString()) {
                reject('Channels address not same');
            }


            this.fromWalletA = this.channelA.fromWallet({
                wallet: this.walletA,
                secretKey: this.keyPairA.secretKey
            });

            this.fromWalletB = this.channelB.fromWallet({
                wallet: this.walletB,
                secretKey: this.keyPairB.secretKey
            });


            this.fromWalletA.deploy().send(toNano('0.05')).then(() => {

                console.log('Deploying channel...')

                const checkDeploy = () => {
                    return new Promise((resolve) => {
                        this.channelA.getChannelState().then((status) => {
                            console.log('Deployed!');
                            resolve(true);
                        }).catch(err => { 
                            // console.log('Not deployed'); 
                            resolve(false) 
                        })
                    })
                }

                const loopCheckDeploy = () => {
                    checkDeploy().then(deployed => {
                        if (deployed) {

                            this.channelA.getChannelState().then(async status => {

                                console.log('Current Channel State: ', status);
                                const data = await this.channelA.getData();
                                // console.log(data)
                                console.log('balanceA = ', data.balanceA.toString())
                                console.log('balanceB = ', data.balanceB.toString())
                
                                let toTopA = channelInitState.balanceA.toNumber() - data.balanceA.toNumber();
                                let toTopB = channelInitState.balanceB.toNumber() - data.balanceB.toNumber();

                                console.log('Top Up A with: ', toTopA);
                                console.log('Top Up B with: ', toTopB);


                                this.fromWalletA
                                    .topUp({coinsA: new BN(toTopA.toString()), coinsB: new BN(0)})
                                    .send(channelInitState.balanceA.add(toNano('0.05')))
                                    
            
                                this.fromWalletB
                                    .topUp({coinsA: new BN(0), coinsB: new BN(toTopB.toString())})
                                    .send(channelInitState.balanceB.add(toNano('0.05')))

                                const checkTopUp = () => {
                                    return new Promise((resolve) => {
                                        this.channelA.getData().then((data) => {
                                            if (
                                                channelInitState.balanceA.toNumber() == data.balanceA.toNumber() &&
                                                channelInitState.balanceB.toNumber() == data.balanceB.toNumber()
                                            ) {
                                                console.log('Topped up!');
                                                resolve(true);
                                            } else {
                                                resolve(false);
                                            }
                                        })
                                    })
                                }

                                const loopcheckTopUp = () => {
                                    checkTopUp().then(topped => {
                                        if (topped) {

                                            this.channelA.getData().then(data => {
                                                console.log('balanceA = ', data.balanceA.toString())
                                                console.log('balanceB = ', data.balanceB.toString())
                                            });

                                            this.fromWalletA.init(channelInitState).send(toNano('0.05'))
                                                .then(() => {

                                                    console.log('Initializing...')
                                                    
                                                    const checkInit = () => {
                                                        return new Promise((resolve) => {
                                                            this.channelA.getChannelState().then(status => {
                                                                if (status != 0) {
                                                                    console.log('Initialized! Status: ', status);
                                                                    resolve(true);
                                                                } else {
                                                                    resolve(false);
                                                                }
                                                            })
                                                        })
                                                    }

                                                    const loopCheckInit = () => {
                                                        checkInit().then(initialized => {
                                                            if (initialized) {
                                                                this.channelLoading = false
                                                                this.channelActive = true
                                                                resolve()
                                                            } else {
                                                                return loopCheckInit()
                                                            }
                                                        })
                                                    }

                                                    loopCheckInit();
                    
                                            })
                                            .catch(err => reject(err))

                                        } else {
                                            return loopcheckTopUp()
                                        }
                                    })
                                }
                                
                                loopcheckTopUp();
        
                            })
                            

                        } else {
                            return loopCheckDeploy()
                        }
                    })
                }

                loopCheckDeploy()

            }).catch(err => reject(err))

        })
    }

    pay(amount) {
        return new Promise((resolve, reject) => {
            if (!this.channelActive) reject('No active channel!')

            amount = amount.toString();
        
            console.log('Starting payment with amount of: ', amount);

            const channelState = {
                balanceA: new BN(this.lastState.balanceA.toNumber() - toNano(amount).toNumber()),
                balanceB: new BN(this.lastState.balanceB.toNumber() + toNano(amount).toNumber()),
                seqnoA: new BN(this.lastState.seqnoA.toNumber() + 1),
                seqnoB: new BN(0)
            };

            console.log('New balance A: ', channelState.balanceA.toNumber())
            console.log('New balance B: ', channelState.balanceB.toNumber())
            console.log('New seq A: ', channelState.seqnoA.toNumber())

            this.channelA.signState(channelState).then(signatureA1 => {
                this.channelB.verifyState(channelState, signatureA1).then(valid => {
                    if (!valid) {
                        reject('Invalid A signature');
                    } else {
                        // console.log('State valid')
                        this.channelB.signState(channelState).then(signatureB1 => {
                            console.log('Transferring...')

                            this.lastState = channelState
                            resolve(true)


                            // Not sure if this below is needed

                            // const checkTopUp = () => {
                            //     return new Promise((resolve) => {
                            //         this.channelA.getData().then((data) => {
                            //             if (
                            //                 channelState.balanceA.toNumber() == data.balanceA.toNumber() &&
                            //                 channelState.balanceB.toNumber() == data.balanceB.toNumber()
                            //             ) {
                            //                 console.log('Transferred!');
                            //                 console.log('balanceA = ', data.balanceA.toString())
                            //                 console.log('balanceB = ', data.balanceB.toString())
                            //                 resolve(true);
                            //             } else {
                            //                 // console.log(data.balanceA.toString(), data.balanceB.toString())
                            //                 resolve(false);
                            //             }
                            //         })
                            //     })
                            // }
            
                            // const loopcheckTopUp = () => {
                            //     checkTopUp().then(topped => {
                            //         if (topped) {
            
                            //             this.lastState = channelState
                            //             resolve(true)
            
                            //         } else {
                            //             return loopcheckTopUp();
                            //         }
                            //     })
                            // }
                            // 
                            // loopcheckTopUp()

                        }).catch(err => reject(err))
                    }
                }).catch(err => reject(err))
                
            }).catch(err => reject(err))
            

        })
    }

    closeChannel() {
        return new Promise((resolve, reject) => {
            if (!this.channelActive) reject('No active channel!')

            console.log('Close channel')

            const theLastState = {
                balanceA: this.lastState.balanceA,
                balanceB: this.lastState.balanceB,
                seqnoA: new BN(this.lastState.seqnoA.toNumber() + 1),
                seqnoB: new BN(this.lastState.seqnoB.toNumber() + 1)
            };

            console.log('The last state for closing: ', theLastState)
        
            this.channelB.signClose(theLastState).then(signatureCloseB => {

                this.channelA.verifyClose(theLastState, signatureCloseB).then(valid => {

                    if (!valid) {
                        reject('Invalid A signature');
                    } else {
                        this.fromWalletA.close({
                            ...theLastState,
                            hisSignature: signatureCloseB
                        }).send(toNano('0.05')).then(() => {

                            console.log('Closing the channel...')

                            const checkClosed = () => {
                                return new Promise((resolve) => {
                                    this.channelA.getChannelState().then(status => {
                                        if (status != 1) {
                                            console.log('Closed! Status: ', status);
                                            resolve(true);
                                        } else {
                                            // console.log('Status: ', status);

                                            // this.channelA.getData().then((data) => {
                                            //     console.log('balanceA = ', data.balanceA.toString())
                                            //     console.log('balanceB = ', data.balanceB.toString())
                                            // })

                                            resolve(false);
                                        }
                                    })
                                })
                            }

                            const loopcheckClosed = () => {
                                checkClosed().then(closed => {
                                    if (closed) {

                                        this.channelActive = false
                                        resolve(true)

                                    } else {
                                        return loopcheckClosed()
                                    }
                                })
                            }

                            loopcheckClosed();

                        }).catch(err => reject(err)) 
                    }

                }).catch(err => reject(err))                

            }).catch(err => reject(err))

        })
    }

    getBalance() {
        return new Promise(async (resolve, reject) => {       
            if (!this.walletAddressA) reject('No user wallet!');

            this.tonweb.getBalance(this.walletAddressA).then(balanceA => {
                resolve(balanceA / 1000000000);
            });
        
        })
    }
}

// USAGE

/*
// make instance 
const t = new TonService();

// initialize wallets
t.initWallets().then(() => {

    //starting the channel
    t.startChannel().then(() => {
        
        console.log('Channel started.')

        //transferring 1 ton off-chain
        t.pay(1).then(() => {

            console.log('Paid 1')

            //transferring 0.5 ton off-chain
            t.pay(0.5).then(() => {

                console.log('Paid 0.5')

                //closing channel and distributing money
                t.closeChannel().then(() => {
                    
                    console.log('Channel closed.')

                }).catch(err => {
                    console.log('error...\n\n', err)
                })

            }).catch(err => {
                console.log('error...\n\n', err)
            })

        }).catch(err => {
            console.log('error...\n\n', err)
        })
        
    }).catch(err => {
        console.log('error...\n\n', err)
    })

    // get user balance
    // t.getBalance().then(balance => console.log(balance))
})
*/

module.exports = TonService;