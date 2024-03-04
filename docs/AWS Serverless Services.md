bak senden istediğim işlev oluşturmuş olduğun md dosyasının içeriğinin bu yapıya benzemesi  AWS uygulamanız ve stack'inizin 3 katmanı için de ayrı ayrı hizmetler sunar. Bu hizmetler compute, integration ve data store dur. 

Compute:
- [[AWS Lambda]]
- [[AWS Fargate]]

Application Integration:
- [[Amazon Event Bridge]]
- [[AWS Step Functions]]
- [[Amazon SQS]]
- [[Amazon SNS]]
- [[Amazon API Gateway]]
- [[AWS AppSync]]
Data Store:
- [[Amazon S3]]
- [[Amazon EFS]]
- [[Amazon Dynamo DB]]
- [[Amazon ElastiCache Serverless]]
- [[Amazon OpenSearch Serverless]]


Kullanım alanları:

- Web Applications: Örneğin Kayıtlı bir kullanıcının öğeleri oluşturmasına, güncellemesine, görüntülemesine ve silmesine olanak tanıyan basit bir "yapılacaklar listesi" web uygulaması oluşturulsun. Event-driven bir web uygulaması mantığı için [[AWS Lambda]], ve [[Amazon API Gateway]]'i, veritabanı olarak [[Amazon Dynamo DB]]'yi ve tüm statik içeriği barındırmak için AWS Amplify Console'u kullanabilir.

![Technical-Diagrams_Serverless-Category-Page_WORKING](https://d1.awsstatic.com/webteam/category-pages/Serverless/Arch-Diagrams_Serverless-Category-Page_WebApp.53f342d820814986db1c9cc6ec5ed80bb74cae32.jpg "Technical-Diagrams_Serverless-Category-Page_WORKING")


Data Processing:

Bir röportajın notlarını Markdown formatında Amazon S3'e iletilir. Birden fazla işlem akışını tetiklemek için S3 Events kullanılır. Biri markdown dosyalarını HTML'e dönüştürmek ve kalıcı kılmak için diğeri ise duyarlılığı tespit etmek ve kalıcı kılmak için

![Technical-Diagrams_Serverless-Category-Page_WORKING](https://d1.awsstatic.com/webteam/category-pages/Serverless/Arch-Diagrams_Serverless-Category-Page_DataProcessing.a2c124d60276c698d2b28714e97e7f8f6d8d706e.jpg "Technical-Diagrams_Serverless-Category-Page_WORKING")


Batch Processing:

Amazon EventBridge rule kullanarak iş akışlarını yinelenen bir temelde planlansın. Örneğin, [[AWS Step Functions]] ve [[AWS Lambda]]'yı kullanarak Aktarım Yükünü Çıkarma (ETL) iş akışını düzenleyerek hava kalitesi ölçümleri için minimum, maksimum ve ortalama derecelendirmeleri oluşturabilirsiniz.

![Technical-Diagrams_Serverless-Category-Page_WORKING](https://d1.awsstatic.com/webteam/category-pages/Serverless/Arch-Diagrams_Serverless-Category-Page_EDA.a3c49f5f8deb0d28fe15aa99def7135b6de40493.jpg "Technical-Diagrams_Serverless-Category-Page_WORKING")


Event Alımı:

Belgeleri ve görüntüleri otomatik olarak indexleyin ve depolanır.

Yapılandırılmamış verilerdeki bilgileri ortaya çıkarmak ve sonuçları hızlı indeksleme için Amazon OpenSearch'e (Amazon Elasticsearch Service'in halefi) göndermek için Amazon Comprehend ve Amazon Rekognition gibi Amazon makine öğrenimi (ML) hizmetlerini kullanın. Bunun gibi modeller, tıklama akışı analizi gibi kişiselleştirilmiş müşteri deneyimlerini destekleyen görevler için e-ticaret uygulamalarında iyi çalışır.

![Technical-Diagrams_Serverless-Category-Page_WORKING](https://d1.awsstatic.com/webteam/category-pages/Serverless/Arch-Diagrams_Serverless-Category-Page_EDA.a3c49f5f8deb0d28fe15aa99def7135b6de40493.jpg "Technical-Diagrams_Serverless-Category-Page_WORKING") buradaki mantık Compute başlığı yerinde benim fonksiyonum Files isimli bir kısım barındıracak ve  yapının gerçekleştirmesini istediğim şey bu olan bir projenin src dizinin altında cli.ts, documentation-generator.ts, index.ts, isimli belgeler, models isimli dosya var, src dizinin md dosyası oluşturulurken, src nin içerisinde içerikler files isimli bir başlık oluşturup her bir belge ismini '[[belge ismi ]]' şeklinde eklemeni istiyorum örneğin 
### Src Folder

Documentation:
Bu kısım daha geliştirilmedi

Files:
- [[ cli.ts ]]
- [[index.ts ]]
- [[models ]]
- [[documentation-generator.ts ]]

