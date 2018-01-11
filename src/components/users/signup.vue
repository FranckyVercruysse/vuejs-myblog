<template>
  <b-container>
      <b-row>
          <b-col cols="12" md="6" offset-md="3">
                <b-card no-body>
                    <h4 slot="header">Sign Up</h4>
                    <b-card-body>
                        <p class="card-text">
                            Some quick example text to build on the card title and make up the bulk of the card's content.
                        </p>
                    </b-card-body>
                    
                    <b-card-body>
                        <b-form @submit.prevent="onSignUp" @reset.prevent="onReset" v-if="show">
                            <b-form-group id="emailInputGroup"
                                            label="Email address:"
                                            label-for="emailInput"
                                            description="We'll never share your email with anyone else."
                                            :invalid-feedback="invalidFeedbackEmail"
                                            :valid-feedback="validFeedbackEmail"
                                            :state="stateEmail"
                                            >
                                <b-form-input id="emailInput"
                                            type="email"
                                            v-model="form.email"
                                            :state="stateEmail"
                                            required
                                            placeholder="Enter email">
                                </b-form-input>
                            </b-form-group>
                            <b-form-group id="nameInputGroup"
                                            label="Your Name:"
                                            label-for="nameInput"
                                            :invalid-feedback="invalidFeedbackName"
                                            :valid-feedback="validFeedbackName"
                                            :state="stateName"
                                            >
                                <b-form-input id="nameInput"
                                            type="text"
                                            v-model="form.name"
                                            :state="stateName"
                                            required
                                            placeholder="Enter name">
                                </b-form-input>
                            </b-form-group>
                            <b-form-group id="passwordInputGroup"
                                            label="Your password:"
                                            label-for="passwordInput"
                                            :invalid-feedback="invalidFeedbackPassword"
                                            :valid-feedback="validFeedbackPassword"
                                            :state="statePassword"
                                            >
                                <b-form-input id="passwordInput"
                                            type="password"
                                            v-model="form.password"
                                            :state="statePassword"
                                            required
                                            placeholder="Enter your password">
                                </b-form-input>
                            </b-form-group>

                            <b-form-group id="confirmpasswordInputGroup"
                                            label="Confirm password:"
                                            label-for="confirmpasswordInput"
                                            :invalid-feedback="invalidFeedbackConfirmpassword"
                                            :valid-feedback="validFeedbackConfirmpassword"
                                            :state="stateConfirmpassword"
                                            >
                                <b-form-input id="confirmpasswordInput"
                                            type="password"
                                            :state="stateConfirmpassword"
                                            v-model="form.confirmpassword"
                                            placeholder="Confirm your password">
                                </b-form-input>
                            </b-form-group>
                            <b-button type="submit" variant="primary" :disabled="!state">Sign Up</b-button>
                            <b-button type="reset" variant="danger">Reset</b-button>
                        </b-form>
                    </b-card-body>
                </b-card>
          </b-col>
      </b-row>
  </b-container>
</template>

<script>
import Firebase from "firebase";

export default {
    computed: {
        state () {
            return this.stateEmail && this.stateName && this.statePassword && this.stateConfirmpassword
        },
        stateEmail(){
            return this.$parent.$options.methods.validateEmail(this.form.email);
        },
        stateName(){
            return this.form.name.length >=4;
        },
        statePassword(){
            return this.$parent.$options.methods.checkPassword(this.form.password);
        },
        stateConfirmpassword(){
            return this.form.password.length>0 && this.form.password === this.form.confirmpassword
        },
        invalidFeedbackName () {
            if (this.form.name.length ==0) {
                return ''
            }
            else {
                this.form.name.length<4 ? 'Your name must be at least 4 characters, keep typing ...':'';
            }
        },
        validFeedbackName () {
            return 'hello '+ this.form.name;
        },
        invalidFeedbackPassword () {
            return this.$parent.$options.methods.invalidFeedbackPassword(this.form.password);
        },
        validFeedbackPassword () {
            return 'Password is OK';
        },
        invalidFeedbackConfirmpassword () {
            if (this.form.password === this.form.confirmpassword) {
                return ''
            } else if (this.form.confirmpassword.length > 0) {
                return 'Password does not match the confirm password, keep trying ..';
            } else {
                return ''
            }
        },
        validFeedbackConfirmpassword () {
            return  'Password and the confirm password are the same';
        },
        invalidFeedbackEmail () {
            return this.$parent.$options.methods.invalidFeedbackEmail(this.form.email);
        },
        validFeedbackEmail () {
            return 'Email is valid';
        },
        
    },
    data () {
        return {
        form: {
            email: '',
            name: '',
            password: '',
            confirmpassword:''
        },
        show: true
        }
    },
    methods: {
        onSignUp () {
            Firebase.auth()
                .createUserWithEmailAndPassword(this.form.email, this.form.password)
                .then(
                    user => {
                        this.$router.replace('add');
                    },
                    error => {
                        console.log(error.message)
                    }
                );
        },
        onReset () {
            /* Reset our form values */
            this.form.email = '';
            this.form.name = '';
            this.form.password = '';
            this.form.confirmpassword = '';
            /* Trick to reset/clear native browser form validation state */
            this.show = false;
            this.$nextTick(() => { this.show = true });
        },
    }
}
</script>