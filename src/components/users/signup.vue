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
                        <b-form @submit="onSignUp" @reset="onReset" v-if="show">
                            <b-form-group id="emailInputGroup"
                                            label="Email address:"
                                            label-for="emailInput"
                                            description="We'll never share your email with anyone else.">
                                <b-form-input id="emailInput"
                                            type="email"
                                            v-model="form.email"
                                            required
                                            placeholder="Enter email">
                                </b-form-input>
                            </b-form-group>
                            <b-form-group id="nameInputGroup"
                                            label="Your Name:"
                                            label-for="nameInput">
                                <b-form-input id="nameInput"
                                            type="text"
                                            v-model="form.name"
                                            required
                                            placeholder="Enter name">
                                </b-form-input>
                            </b-form-group>
                            <b-form-group id="passwordInputGroup"
                                            label="Your password:"
                                            label-for="passwordInput">
                                <b-form-input id="passwordInput"
                                            type="password"
                                            v-model="form.password"
                                            required
                                            placeholder="Enter your password">
                                </b-form-input>
                            </b-form-group>

                            <b-form-group id="confirmpasswordInputGroup"
                                            label="Confirm password:"
                                            label-for="confirmpasswordInput"
                                            :invalid-feedback="invalidFeedbackConfirmpassword"
                                            :valid-feedback="validFeedbackConfirmpassword"
                                            :state="state"
                                            >
                                <b-form-input id="confirmpasswordInput"
                                            type="password"
                                            :state="state"
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
export default {
    computed: {
        state () {
            return this.form.password === this.form.confirmpassword ? true : false
        },
        invalidFeedbackConfirmpassword () {
            if (this.form.password === this.form.confirmpassword) {
                return ''
            } else if (this.form.confirmpassword.length > 0) {
                return 'Password does not match the confirm password';
            } else {
                return ''
            }
        },
        validFeedbackConfirmpassword () {
            return this.form.password.length >0 && this.state === true ? 'Password and the confirm password are the same' : ''
        }
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
        onSignUp (evt) {
            evt.preventDefault();
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
        }
    }
}
</script>
