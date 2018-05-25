import baseMutation from './base'
import cateMutation from './category'
import productMutation from './product'
import frontCateMutation from './frontCate'
import saleBrand from './saleBrand'
export default {
  ...baseMutation,
  ...cateMutation,
  ...productMutation,
  ...frontCateMutation,
  ...saleBrand
}
