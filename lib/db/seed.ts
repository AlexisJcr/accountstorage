import { db, loginTable, a2fTable, entrepriseTable, dataTable } from "./schema"
import bcrypt from "bcryptjs"
import { sql } from "drizzle-orm"

async function hash(str: string) {
  return await bcrypt.hash(str, 10)
}

export async function seed() {
  try {
    const existingLogin = await db.select().from(loginTable).limit(1)

    if (existingLogin.length === 0) {
      const hashedPassword = await hash("energix-superadmin")

      await db.insert(loginTable).values({
        nom: await hash("Informatique"),
        prenom: await hash("ENERGIX"),
        identifiant: await hash("superadmin"),
        motDePasse: hashedPassword,
        role: "superadmin",
      })

      console.log("Compte superadmin créé")
    }

    const existingA2F = await db.select().from(a2fTable).limit(1)

    if (existingA2F.length === 0) {
      await db.insert(a2fTable).values({
        code: "29430",
      })

      console.log("Code A2F créé")
    }

    const existingEntreprise = await db.select().from(entrepriseTable).limit(1)

    if (existingEntreprise.length === 0) {
      await db.insert(entrepriseTable).values({
        nom: "ENERGIX",
        adresse: "Plounévez-Lochrist",
        telephone: "012345678",
      })

      console.log("Entreprise ENERGIX créée")

      const entrepriseId = (
        await db.select().from(entrepriseTable).where(sql`${entrepriseTable.nom} = 'ENERGIX'`)
      ).at(0)?.id

      if (entrepriseId) {
        await db.insert(dataTable).values([
          {
            nom: await hash("Dupont"),
            prenom: await hash("Jean"),
            entrepriseId,
            typeInfo: "ad",
            identifiant: await hash("jean.dupont"),
            motDePasse: await hash("jeandupont29"),
          },
          {
            nom: await hash("BOSSARD"),
            prenom: await hash("Amélie"),
            entrepriseId,
            typeInfo: "adresse email",
            identifiant: await hash("amelie.bossard@energix.com"),
            motDePasse: await hash("ameliebossard29"),
          },
        ])

        console.log("Données d'exemple créées")
      }
    }

    console.log("Base de données initialisée avec succès")
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données:", error)
  }
}
