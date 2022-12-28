import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


const prismaMiddleware = () => {
    /***********************************/
    /* SOFT DELETE MIDDLEWARE */
    /***********************************/

    prisma.$use(async (params, next) => {
        // Check incoming query type
        console.log("runnnning")
        if (params.action == 'delete') {
            // Delete queries
            // Change action to an update
            console.log("runn")
            params.action = 'update'
            params.args['data'] = { deletedAt: new Date() }
        }
        if (params.action == 'deleteMany') {
            // Delete many queries
            params.action = 'updateMany'
            if (params.args.data != undefined) {
                params.args.data['deletedAt'] = new Date()
            } else {
                params.args['data'] = { deletedAt: new Date() }
            }
        }
        return next(params)
    })

}
export default prismaMiddleware