
import scopeCheck from "../middleware/scopecheck.js";
import user from "../middleware/user.js";
import Authentication from "../middleware/authentication.js"
import Google from'passport-google-oauth20';
import passport from 'passport';
import AuthController from "../controller/authController.js";

const GoogleStrategy=Google.Strategy;
class AuthRoutes extends AuthController {
    constructor(router) {
        super();
        router.route('/signup')
        .post((req, res) => {
            this.signUp(req,(response) => {
                res.status(response.status).send(response.data);
            })
        }),
        router.route('/login')
            .post((req ,res) => {
                this.login(req, (response) => {
                    res.status(response.status).send(response.data);
                })
            }),


            router.route('/logout')
            .post((req, res )=> {
                this.logout(req, (response) => {
                    res.status(response.status).send(response.data);
                })
            }),
         

            router.route('/forgot-password')
            .post((req, res )=> {
                this.forgotPassword(req, (response) => {
                    res.status(response.status).send(response.data);
                })
            }),
            
            router.route('/reset-password')
            .post(
                // user.checktoken,
                (req, res )=> {
                this.resetPassword(req, (response) => {
                    res.status(response.status).send(response.data);
                })
            }),
            router.route('/revoketoken')
            .post((req, res) => {
                this.checkRefreshToken(req, (response) => {
                    res.status(response.status).send(response.data);
                })
            }),
            passport.use(new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENTID,
                clientSecret: process.env.GOOGLE_CLIENTSECRET,
                callbackURL: "http://localhost:8000/app/v1/auth/google/callback"
              },
              (accessToken, refreshToken, profile, done) =>{
                this .createGoogleuser(accessToken,refreshToken,profile,(user)=>{

                    
                    return done(user)
                })
              }
            ));



            router.route('/auth/google')
            .get(passport.authenticate('google',{ scope: ['profile','email'] }))
            
            
            router.route('/auth/google/callback')
            .get(passport.authenticate('google',{ failureRedirect: '/login' }),
            (req,res,next)=>{
             res.redirect("/");
                
            })

    }
};
export default AuthRoutes;