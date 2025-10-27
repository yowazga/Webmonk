import { ActionFunctionArgs, json } from "@remix-run/node"

export const action = async ({request}:ActionFunctionArgs) => {

    const {productIds, customValue} = await request.json();

    if (!productIds || !customValue || !Array.isArray(productIds)) {
        return json({message: "missing data..."}, {status: 400});
    }

    console.log(productIds, customValue);

    return json({ok: true});
}