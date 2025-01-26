
const currentDate = () => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
    const dia = String(fecha.getDate()).padStart(2, '0'); 
    return `${año}-${mes}-${dia}`;
}

export const billFormat = (contactData, products, moreInfo) => {

    if (!contactData || !Array.isArray(products)) {
        throw new Error("Datos de entrada inválidos");
    }

    const { payment_form = "1", 
            is_excluded = 0, 
            quantity = 1, 
            payment_method_code = "10",
            legal_organization_id = "1",
            observation = ""
        } = moreInfo;

    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let referenceCode = '';

    for (let i = 0; i < 10; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        referenceCode += caracteres[indiceAleatorio];
    }

    const format = {
        "numbering_range_id": 8,
        "reference_code": referenceCode,
        "observation": observation,
        "payment_form": payment_form,
        "payment_due_date": currentDate(),
        "payment_method_code": payment_method_code,
        "billing_period": {
            "start_date": "2024-01-10",
            "start_time": "00:00:00",
            "end_date": "2024-02-09",
            "end_time": "23:59:59"
        },
         "customer": {
            "identification": String(contactData.document_number) || "123456789",
            "dv": "3",
            "company": contactData?.company || "",
            "trade_name": contactData?.company || "",
            "names": contactData?.names,
            "address": contactData?.address,
            "email": contactData?.email,
            "phone": contactData?.phone,
            "legal_organization_id": legal_organization_id,
            "tribute_id": "21",
            "identification_document_id": contactData?.type_document_ID || "1",
            "municipality_id": contactData?.municipality_ID || "80"
        }, "items": products.map(product => (
            {
                "code_reference": String(product?.product_ID || "1000001"),
                "name": product?.name || "Producto Prueba", 
                "quantity": quantity,
                "discount_rate": 0,
                "price": product?.price || 1000,
                "tax_rate": String(product?.tax_rate) || "5.00",
                "unit_measure_id": product?.unit_measure_ID || "70",
                "standard_code_id": 1,
                "is_excluded": is_excluded,
                "tribute_id": 1,
                "withholding_taxes": []
            }
        ))
    }

    return format;
}