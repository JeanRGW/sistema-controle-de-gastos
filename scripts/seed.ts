import db from "@/lib/db"
import { usersTable, categoriesTable, entriesTable } from "@/lib/db/schema"

async function main() {
    await db.insert(usersTable).values({
        id: -1,
        email: "admin@admin.com",
        name: "Admin",
        password: "admin",
    })

    await db.insert(categoriesTable).values([
        { name: "Não categorizado", id: -1},
        { name: "Assinaturas", id: -2},
        { name: "Salário", id: -3 }
    ])

    await db.insert(entriesTable).values([
        { categoryId: 1, date: new Date(), name: "Teste", userId: -1, value: "100.0", isRecurring: false }
    ])
}

main().catch(err => {
    console.error(err);
})