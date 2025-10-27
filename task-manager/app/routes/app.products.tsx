import { Banner, Button, Card, List, Page, Text, TextField } from "@shopify/polaris";
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


    const [isLoading, setIsLoading] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleOpenPicker = async () => {

        setSuccessMessage("");
        setErrorMessage("");
        
        try {
        
            const selected = await app.resourcePicker({
                type: 'product',
                multiple: true,
            });

            if (selected) {
                const products = selected.map((product: any) => ({
                    id: product.id,
                    title: product.title,
                }));
                setSelectedProducts(products);
            }
        } catch (error) {
            console.log("picker was cancelled.", error);
        }
    }

    const handleSave = async () => {
        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const response = await fetch("/api/save", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                productIds: selectedProducts.map(p => p.id),
                customValue: customValue,
            }),
         });

        setIsLoading(false);

        if (response.ok) {
            setSuccessMessage("Successfully saved metafields");
        } else {
            const errorResult = await response.json();
            setErrorMessage(errorResult.message || "An error occurred.");
        }
        } catch (error) {
            setIsLoading(false);
            setErrorMessage("Network error: ");
        }
        
    };
    
    
    return (
      <Page>
        {successMessage && <Banner title={successMessage} tone="success" onDismiss={() => setSuccessMessage("")} />}
        {errorMessage && <Banner title={errorMessage} tone="critical" onDismiss={() => setErrorMessage("")} />}
        <div style={{ margin: "20px 0" }}>
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
                  placeholder="type something"
                />
                <div style={{ marginTop: "10px" }}>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    loading={isLoading}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </Page>
    );
}