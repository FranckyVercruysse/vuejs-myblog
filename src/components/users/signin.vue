<template>
  <b-container>
      <b-row>
          <b-col cols="12" md="6" offset-md="3">
                <b-card no-body>
                    <h4 slot="header">Sign In</h4>
                    <b-card-body>
                        <p class="card-text">
                            Some quick example text to build on the card title and make up the bulk of the card's content.
                        </p>
                    </b-card-body>
                    
                    <b-card-body>
                        <b-form @submit.prevent="onSignIn" @reset="onReset" v-if="show">
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
                            <b-button type="submit" variant="primary" :disabled="!state" v-on:click="onSignIn">
                                Sign In</b-button>
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
    data () {
        return {
        form: {
            email: '',
            password: '',
        },
        show: true
        }
    },
    computed: {
        state () {
            return this.stateEmail && this.statePassword;
        },
        stateEmail(){
            return this.$parent.$options.methods.validateEmail(this.form.email);
        },
        statePassword(){
            return this.$parent.$options.methods.checkPassword(this.form.password);
        },
        invalidFeedbackEmail () {
            return this.$parent.$options.methods.invalidFeedbackEmail(this.form.email);
        },
        validFeedbackEmail () {
            return 'Email is valid';
        },
        invalidFeedbackPassword () {
            return this.$parent.$options.methods.invalidFeedbackPassword(this.form.password);
        },
        validFeedbackPassword () {
            return 'Password is OK';
        },
    },
    methods: {
        onSignIn () {
            Firebase.auth()
                .signInWithEmailAndPassword(this.form.email, this.form.password)
                .then(
                    user => {
                        this.$router.replace('add');
                    },
                    error => {
                        alert(error.message);
                    }
                    );
            alert(JSON.stringify(this.form));
        },
        onReset (evt) {
            evt.preventDefault();
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
