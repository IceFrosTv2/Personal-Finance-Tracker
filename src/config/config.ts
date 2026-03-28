const host = import.meta.env.VITE_HOST;
const config = {
    host,
    api: host + '/api',
    routes: {
        home: '/',
        login: '/login',
        register: '/register',
        notFound: '/404',
        operations: {
            list: '/operations',
            create: '/operations/create',
            edit: '/operations/edit',
        },
        categories: {
            income: {
                list: '/categories/income',
                create: '/categories/income/create',
                edit: '/categories/income/edit',
            },
            expense: {
                list: '/categories/expense',
                create: '/categories/expense/create',
                edit: '/categories/expense/edit',
            },
        }
    },
}

export default config
