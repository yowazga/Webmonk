import { ActionFunctionArgs, json } from "@remix-run/node"
import prisma from "app/db.server";
import { authenticate } from "app/shopify.server";

export const action = async ({request}:ActionFunctionArgs) => {

    const {productIds, customValue} = await request.json();

    if (!productIds || !customValue || !Array.isArray(productIds)) {
        return json({message: "missing data..."}, {status: 400});
    }

    console.log(productIds, customValue);

    const authResult = await authenticate.admin(request);
    const shop = authResult.session.shop;

    const metafieldsInputs = productIds.map((productId) => ({
        ownerId: productId,
        namespace: "custom",
        key: "custom_field",
        type: "single_line_text_field",
        value: customValue,
    }));

    const mutation = `
    mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id }
        userErrors { field message }
      }
    }
  `;

  try {
    const response = await authResult.admin.graphql(mutation, {
        variables: {metafields: metafieldsInputs},
    });
    const jsonResponse = await response.json();

    const errors = jsonResponse.data?.metafieldsSet?.userErrors;
    if (errors && errors.length > 0) {
        return json({message: errors[0].message}, {status: 400});
    }
  } catch (error) {
    console.error("shopofy error:", error);
    return json({message: "failed to save to shopify"}, {status: 500});
  }

  try {
    await prisma.productMeta.createMany({
        data: productIds.map((productId) => ({
            shop: shop,
            productId: productId,
            namespace: "custom",
            key: "custom_field",
            value: customValue,
        })),
        skipDuplicates: true,
    });
  } catch (error) {
    console.error("database error:", error);
    return json({message: "error saving to database"}, {status: 500});
  }

    return json({ok: true});
}