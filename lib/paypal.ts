// Définition de l'URL de base de l'API PayPal : sandbox ou production selon l'environnement
const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com'



// Objet contenant les méthodes PayPal à utiliser dans le projet
export const paypal = {

  // Méthode pour créer une commande PayPal avec un montant donné
  createOrder: async function createOrder(price: number) {
     
    // Génération d'un token d'accès OAuth 2.0
    const accessToken = await generateAccessToken()

    // URL de l'API pour la création d'une commande
    const url = `${base}/v2/checkout/orders`

    // Appel à l'API PayPal pour créer une commande
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // Authentification via le token
      },
      body: JSON.stringify({
        intent: 'CAPTURE', // Capture immédiate du paiement après autorisation
        purchase_units: [
          {
            amount: {
              currency_code: 'USD', // Devise de la transaction
              value: price,          // Montant total à facturer
            },
          },
        ],
      }),
    })

    // Traitement de la réponse
    return handleResponse(response)
  },

  // Méthode pour capturer un paiement à partir d'un orderId
  capturePayment: async function capturePayment(orderId: string) {
    const accessToken = await generateAccessToken()
    const url = `${base}/v2/checkout/orders/${orderId}/capture`

    // Appel API pour capturer le paiement d'une commande existante
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return handleResponse(response)
  },
}

// Fonction privée pour générer un token d'accès PayPal à partir du client ID et secret
async function generateAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env

  // Encodage des identifiants client:secret en base64 pour l'authentification Basic
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_APP_SECRET).toString(
    'base64'
  )

  // Appel de l'API OAuth de PayPal pour récupérer le token d'accès
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'post',
    body: 'grant_type=client_credentials', // Demande d’un token en tant qu’application
    headers: {
      Authorization: `Basic ${auth}`, // Authentification avec Basic Auth
    },
  })

  // Retourne le token d’accès récupéré
  const jsonData = await handleResponse(response)
  return jsonData.access_token
}

// Fonction utilitaire pour gérer les réponses HTTP
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleResponse(response: any) {
  // Si succès (code 200 ou 201), on retourne le corps JSON
  if (response.status === 200 || response.status === 201) {
    return response.json()
  }

  // En cas d'erreur, on récupère le texte de l'erreur et on lance une exception
  const errorMessage = await response.text()
  throw new Error(errorMessage)
}
