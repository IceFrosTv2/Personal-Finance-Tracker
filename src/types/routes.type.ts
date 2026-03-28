export type RoutesType = {
    route: string,
    title: string,
    filePathTemplate?: string,
    useLayout?: string,
    load?: () => void,
}
