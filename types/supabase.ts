export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      // Adicione suas tabelas aqui quando as criar
    }
    Views: {
      // Adicione suas views aqui quando as criar
    }
    Functions: {
      // Adicione suas funções aqui quando as criar
    }
  }
}
