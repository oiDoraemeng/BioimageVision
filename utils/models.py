import pymongo

from utils.exts import mongo

class Base:
    collection = None  # 基类中定义的默认集合名称
    @classmethod
    def save(cls, data):
        # 保存数据到数据库
        mongo.db[cls.collection].insert_one(data)

    @classmethod
    def find_by_id(cls, _id):
        # 根据文ID查找数据
        return mongo.db[cls.collection].find_one({"_id": _id})

    @classmethod
    def find_by_condition(cls,condition):
        # 根据条件查找数据
        return mongo.db[cls.collection].find_one(condition)



# 创建用户类
class User(Base):
    """
    user_data = {
        "name": "name",
        "password": "password",
        "email": "admin@example.com"
        "token": "<PASSWORD>"
        "role": "admin/common"
    }
    """
    collection = "user"
    def __init__(self, user_data):
        self._id = user_data.get("_id")
        self.name = user_data.get("name")
        self.password = user_data.get("password")
        self.email = user_data.get("email")
        self.user_data = user_data


    @staticmethod
    def getUser(condition):
        # 查询用户
        user_data = mongo.db.user.find_one(condition)
        user = User(user_data) if user_data else None
        return user

    def update(self, new_data):
        # 更新用户数据
        mongo.db.user.update_one({"_id": self.user_data["_id"]}, {"$set": new_data})

    def delete(self):
        # 删除用户数据
        mongo.db.user.delete_one({"_id": self.user_data["_id"]})

# 创建文章类
class Article(Base):
    """
        article_data = {
        "title": "Sample Article",
        "content": "This is a sample article content.",
        "create_time": datetime.now(),
        author: user,
        "author_id": user._id
    }
    """
    collection = "article"
    def __init__(self, article_data):
        self._id = article_data.get("_id")
        self.title = article_data.get("title")
        self.content = article_data.get("content")
        self.create_time = article_data.get("create_time")


        self.author = article_data.get("author")
        self.author_id = article_data.get("author_id")

    @property
    def comments(self):
        # 获取当前文章的所有评论
        return Comment.getCommentsForArticle({"article_id": self._id})
    @staticmethod
    def getArticleById(_id):
        # 查询文章
        article_data = mongo.db.article.find_one({"_id": _id})
        article = Article(article_data) if article_data else None
        return article

    @staticmethod
    def getArticles(condition=None):
        # 查询文章
        articles_data = mongo.db.article.find(condition).sort("create_time", pymongo.DESCENDING)
        articles_list = [Article(article) for article in articles_data ]
        return articles_list

    def update(self, new_data):
        # 更新文章数据
        mongo.db.article.update_one({"_id": self._id}, {"$set": new_data})

    def delete(self):
        # 删除文章数据
        mongo.db.article.delete_one({"_id": self._id})

# 创建评论类
class Comment(Base):
    """
        comment_data = {
        "content": " comment content",
        "create_time": datetime.now(),

        "author_id": user._id,
        "article_id": article._id
    }
    """
    collection = "comment"
    def __init__(self, comment_data):
        self._id = comment_data.get("_id")
        self.content = comment_data.get("content")
        self.create_time = comment_data.get("create_time")

        self.author_id = comment_data.get("author_id")
        self.article_id = comment_data.get("article_id")

    @property
    def user(self):
        # 获取评论的作者
        return User.getUser({"_id": self.author_id})

    @staticmethod
    def getCommentsForArticle(condition):
        # 查询特定文章的评论
        comments_data = mongo.db.comment.find(condition).sort("create_time", pymongo.DESCENDING)
        comments_list = [Comment(comment) for comment in comments_data]
        return comments_list

    @staticmethod
    def getCommentById(_id):
        # 查询评论
        comment = Comment(mongo.db.comment.find_one({"_id": _id}))
        return comment


    def update(self, new_data):
        # 更新评论数据
        mongo.db.comment.update_one({"_id": self._id}, {"$set": new_data})

    def delete(self):
        # 删除评论数据
        mongo.db.comment.delete_one({"_id": self._id})

class Message(Base):
    """
        message_data = {
            "session_id": session_id
            "from": "customer/agent"
            "content": "message content",
            "create_time": datetime.now(),
            "status": "unread/read"
        }
    """
    collection = "message"
    def __init__(self, message_data):
        self._id = message_data.get("_id")
        self.session_id = message_data.get("session_id")
        self.from_user = message_data.get("from")
        self.content = message_data.get("content")
        self.create_time = message_data.get("create_time")
        # self.status = message_data.get("status")
