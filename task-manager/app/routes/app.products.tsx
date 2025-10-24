import { Button, Card, List, Page, Text, TextField } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useState } from "react";

type SelectedProduct = {
    id: string;
    title: string;
};

export default function ProductMetaForm() {
    const app = useAppBridge();

    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [customValue, setCustomValue] = useState('');

    const handleOpenPicker = async () => {
        
        try {
        
            const selected = await app.resourcePicker({
                type: 'product',
                multiple: true,
                // filter: {
                //     variants: false,
                // },
            });

            if (selected) {
                const products = selected.map((product: any) => ({
                    id: product.id,
                    title: product.title,
                }));
                setSelectedProducts(products);
            }
        } catch (error) {
            console.log("picker was cancelled.");
        }
    }
    
    
    return (
      <Page>
        <Card>
          <Button onClick={handleOpenPicker}>Select products</Button>

          {selectedProducts.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <Text as="h2" variant="headingMd">
                Selected Products
              </Text>
              <List type="bullet">
                {selectedProducts.map((product) => (
                  <List.Item key={product.id}>{product.title}</List.Item>
                ))}
              </List>
            </div>
          )}

          {selectedProducts.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <TextField
                label="Custom field value"
                value={customValue}
                onChange={(value) => setCustomValue(value)}
                autoComplete="off"
              />
              <div style={{ marginTop: "10px" }}>
                <Button variant="primary">Save</Button>
              </div>
            </div>
          )}
        </Card>
      </Page>
    );
}
//    started point from :https://magecomp.com/blog/use-resource-picker-using-shopify-app-bridge-api/
// import { useAppBridge } from "@shopify/app-bridge-react";


// const ProductPicker = () => {
//     const app = useAppBridge();

//     const handleOpenPicker = async (type:any) => {
//         try {
//             const picker = await app.resourcePicker({
//                 type: 'product',
//                 multiple: type === 'y',
//                 filter: {
//                     variants: false,
//                 },
//             });
//             console.log('Selected products:', picker);
//         } catch (error) {
//             console.error("Error opening product picker:", error);
//         }
//     }

//     return (
//         <>
//             <Button onClick={() => handleOpenPicker("y")}>Select Products</Button>
//         </>
//     )
// };

// export default ProductPicker;
