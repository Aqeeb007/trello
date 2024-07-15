import { List, Card } from "@prisma/client";

export type ListWithCards = List & {
    cards: Card[];
}

export type CartWithList = Card & {
    list: List;
}