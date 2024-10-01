export type CategoryConfig = {
    [categoryId: string]: {
        title: string,
        dishes: Array<Dish>
    }
}

export type CategoryPreview = {
    title: string,
    dishes: Array<Dish>,
    expanded?: boolean
}

export type Dish = {
    dishName: string,
    dishDescription: string,
    dishPrice: string,
    _id?: string
}

export type MenuFormProps = {
    menuID: string
}

export type MenuCard = {
    name?: string,
    isPublic?: boolean,
    currency?: string,
    categories?: Array<CategoryPreview>
}