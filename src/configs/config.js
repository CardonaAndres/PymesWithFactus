export const PORT = process.env.PORT || 5050;
export const CLIENT_ORIGIN = ['http://localhost:5173'];
export const SECRET_KEY = process.env.JWT_SECRET || 'factusProject2025';
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
export const colombianPhoneRegex = /^3[0-9]{9}$/;
export const nameRegex = /^[a-zA-ZÀ-ÿ\s\-]+$/; 
export const isProduction = false;
export const serverURL = isProduction ? '' : `http://localhost:${PORT}`;

export const dbConfig = {
    host : "host.docker.internal", // dokcer(host.docker.internal) | trabajo en local(localhost)
    user : "root",
    password : "",
    database : "factus_db",
    port : 3306 
}

export const factusConfig = {
    URL_BASE : 'https://api-sandbox.factus.com.co',
    PASSWORD : '',
    CLIENT_ID : '',
    CLIENT_SECRET : '',
    USERNAME : '',
    GRANT_TYPE : 'password'
}

export const legal_organizations = [
    {
        ID : 1,
        name : "Persona Jurídica"
    }, 
    {
        ID : 2,
        name : "Persona Natural"
    }
]

export const payment_forms = [
    {
        ID : 1,
        name : "Pago de contado"
    }, 
    {
        ID : 2,
        name : "Pago a crédito"
    }
];

export const payment_method_codes = [
    {
        ID : "10",
        name : "Efectivo"
    },
    {
        ID : "42",
        name : "Consignación"
    },
    {
        ID : "20",
        name : "Cheque"
    },
    {
        ID : "47",
        name : "Transferencia"
    },
    {
        ID : "71",
        name : "Bonos"
    },
    {
        ID : "72",
        name : "Vales"
    },
    {
        ID : "1",
        name : "Medio de pago no definido"
    },
    {
        ID : "49",
        name : "Tarjeta Débito"
    },
    {
        ID : "48",
        name : "Tarjeta Crédito"
    }
]

export const documentTypes = [
    {
        ID : 1,
        type : "Registro civil"
    },
    {
        ID: 2,
        type: "Tarjeta de identidad"
    },
    {
        ID: 3,
        type : "Cédula de ciudadanía"
    },
    {
        ID : 4,
        type : "Tarjeta de extranjería"
    },
    {
        ID : 5,
        type : "Cédula de extranjería"
    },
    {
        ID : 6,
        type : "NIT"
    },
    {
        ID : 7,
        type : "Pasaporte"
    },
    {
        ID : 8,
        type : "Documento de identificación extranjero"
    },
    {
        ID : 9,
        type : "PEP"
    },
    {
        ID : 10,
        type : "NIT otro país"
    },
    {
        ID : 11,
        type : "NUIP"
    }
];