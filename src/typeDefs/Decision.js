export const typeDefs = `

"decyzje dotyczące grupy"
type DecisionChange {
    "zawiera informacje czego dotyczy decyzja"
    data: String
    "id grupy której dotyczy decyzja"
    groupId: String
}

"patrz type DecisionChange"
input DecisionChangeInput {
    data: String
    groupId: String
}
`;
