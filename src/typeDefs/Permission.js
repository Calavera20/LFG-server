


export const typeDefs = `

type PermissionChange {
    "informacja o zmianie zezwolenia"
    change: String
    "informacja której grupy dotyczy zmiana"
    groupId: String
}
"patrz PermissionChange"
input PermissionChangeInput {
    change: String
    groupId: String
}
`;