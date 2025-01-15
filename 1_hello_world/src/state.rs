use schemars::JsonSchema;
use secret_toolkit::storage::Keymap;
use serde::{Deserialize, Serialize};

pub static PASSWORD: Keymap<String, Password> = Keymap::new(b"password");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Password {
    pub password: String,
}
