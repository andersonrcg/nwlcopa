import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
    
async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            avatarUrl: 'https://github.com/andersonrcg.png',
        }
    })

    
    const pool = await prisma.pool.create({
        data: {
            title: 'Pool 01',
            code: 'BOL123',
            ownerId: user.id,

            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-25T14:00:00.200Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',
        }
    })
    
    await prisma.game.create({
        data: {
            date: '2022-11-28T14:00:00.200Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }
            }
        }
    })

}

main()