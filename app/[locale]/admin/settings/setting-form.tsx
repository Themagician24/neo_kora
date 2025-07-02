'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

import { SettingInputSchema } from '@/lib/validator'
import { ClientSetting, ISettingInput } from '@/types'
import { updateSetting } from '@/lib/actions/setting.actions'
import useSetting from '@/hooks/use-setting-store'
import LanguageForm from './language-form'
import CurrencyForm from './currency-form'
import PaymentMethodForm from './payment-method-form'

import SiteInfoForm from './site-info-form'
import CommonForm from './common-form'
import CarouselForm from './carousel-form'

import { toast } from 'sonner'
import DeliveryDateForm from '@/app/[locale]/admin/settings/delevery-date-form'

const SettingForm = ({ setting }: { setting: ISettingInput }) => {
  const { setSetting } = useSetting()

  const form = useForm<ISettingInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(SettingInputSchema) as any, // Temporary workaround if schema can't be changed
    defaultValues: setting,
  })
  const {
    formState: { isSubmitting },
  } = form

  
  async function onSubmit(values: ISettingInput) {
    const res = await updateSetting({ ...values })
    if (!res.success) {
      toast(res.message)
    } else {
      toast(res.message)
      setSetting(values as ClientSetting)
    }
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SiteInfoForm id='setting-site-info' form={form} />
        <CommonForm id='setting-common' form={form} />
        <CarouselForm id='setting-carousels' form={form} />

        <LanguageForm id='setting-languages' form={form} />

        <CurrencyForm id='setting-currencies' form={form} />

        <PaymentMethodForm id='setting-payment-methods' form={form} />

        <DeliveryDateForm id='setting-delivery-dates' form={form} />

        <div>
          <Button
            type='submit'
            size='lg'
            disabled={isSubmitting}
            className='w-full mb-24'
          >
            {isSubmitting ? 'Submitting...' : `Save Setting`}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SettingForm
