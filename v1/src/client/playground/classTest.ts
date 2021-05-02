class Model {
  public static whoAmI() {
    console.log("i am", this.prototype);
  }
}

class User extends Model {}

const run = () => User.whoAmI();

export { run };
