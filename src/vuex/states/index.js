import baseState from './base'
import baseCate from './category'
import productCate from './product'
import frontCate from './frontCate'
import saleBrand from './saleBrand'

export default {
  ...baseState,
  ...baseCate,
  ...productCate,
  ...frontCate,
  ...saleBrand
}
