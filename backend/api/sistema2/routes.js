const router = require("express").Router();

// Controller Imports
const S2Controller = require("./controllers/S2Controller");
//const ProviderController = require("./controllers/ProviderController");
// Middleware Imports
const isAuthenticatedMiddleware = require("./../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../common/middlewares/SchemaValidationMiddleware");
/* const CheckPermissionMiddleware = require("../common/middlewares/CheckPermissionMiddleware");
// JSON Schema Imports for payload verification */
/* const createS2Payload = require("./schemas/createS2Payload") */;

/* const updateProductPayload = require("./schemas/updateProductPayload");
const { roles } = require("../config"); */

router.get('/hola',  (_, res) => {
  res.send('Hello from A!, el backend de S2 está funcionando correctamente desde insomnia 123!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
})
//router.post("/validar",[isAuthenticatedMiddleware.check], S2Controller.validar);


router.post(
  "/insertS2v2",
  [
    isAuthenticatedMiddleware.check,
    /* CheckPermissionMiddleware.has(roles.ADMIN), */
    //SchemaValidationMiddleware.verify(createS2Payload),
  ],
  //S2Controller.createS2
  S2Controller.insertS2v2
);

router.post("/getAllS2v2",[isAuthenticatedMiddleware.check], S2Controller.getAllS2v2);
  /* (_, res) => {
    res.send(' Otro endpoint está para insertar está funcionando correctamente!')
  } 
  );*/

  router.post("/listS2v2",[isAuthenticatedMiddleware.check], S2Controller.listS2v2);
  /* (_, res) => {
    res.send(' listS2v2 endpoint está para insertar está funcionando correctamente!')
  }
  ); */


  router.put("/updateS2v2",[isAuthenticatedMiddleware.check], S2Controller.updateS2v2);
  /* (_, res) => {
    res.send(' Otro updateS2v2 endpoint está para insertar está funcionando correctamente!')
  } 
  );*/

/*
  router.post("/deleteS2v2",[isAuthenticatedMiddleware.check], //S2XCController.deleteS2v2);
  (_, res) => {
    res.send(' Otro endpoint está para insertar está funcionando correctamente!')
  }
  );



/* router.post(
  "/insert",
  [
    isAuthenticatedMiddleware.check,
  ],
  //S2Controller.insertS2
   (_, res) => {
    res.send(' Otro endpoint está para insertar está funcionando correctamente!')
  }
 
  ); */


/* router.get(
  "/",
  [isAuthenticatedMiddleware.check],
  ProductController.getAllProducts
);

router.get(
  "/:productId",
  [isAuthenticatedMiddleware.check],
  ProductController.getProductById
);

router.post(
  "/",
  [
    isAuthenticatedMiddleware.check,
    CheckPermissionMiddleware.has(roles.ADMIN),
    SchemaValidationMiddleware.verify(createProductPayload),
  ],
  ProductController.createProduct
);

router.patch(
  "/:productId",
  [
    isAuthenticatedMiddleware.check,
    CheckPermissionMiddleware.has(roles.ADMIN),
    SchemaValidationMiddleware.verify(updateProductPayload),
  ],
  ProductController.updateProduct
);

router.delete(
  "/:productId",
  [isAuthenticatedMiddleware.check, CheckPermissionMiddleware.has(roles.ADMIN)],
  ProductController.deleteProduct
); */

module.exports = router;
